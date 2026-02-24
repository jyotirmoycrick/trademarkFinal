from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import razorpay
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET')
JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 720))

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class PaymentStatus(str, Enum):
    CREATED = "created"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    price: int
    govt_fee: Optional[int] = None
    features: List[str]
    category: str


class CartItem(BaseModel):
    service_id: str
    quantity: int = 1


class AddToCartRequest(BaseModel):
    service_id: str


class CreateOrderRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    business_name: str
    cart_items: List[CartItem]
    coupon_code: Optional[str] = None


class RazorpayOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: str


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    email: EmailStr
    phone: str
    business_name: str
    services: List[dict]
    total_amount: int
    discount: int = 0
    final_amount: int
    status: OrderStatus = OrderStatus.PENDING
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    payment_status: PaymentStatus = PaymentStatus.CREATED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



class LeadStatus(str, Enum):
    STARTED = "started"
    PARTIAL = "partial"
    COMPLETE = "complete"
    PAYMENT_INITIATED = "payment_initiated"
    CONVERTED = "converted"


class AbandonedLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    business_name: Optional[str] = None
    cart_items: Optional[List[dict]] = None
    total_amount: Optional[int] = None
    status: LeadStatus = LeadStatus.STARTED
    user_id: Optional[str] = None
    session_id: str = ""
    razorpay_order_id: Optional[str] = None
    last_step: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UpsertLeadRequest(BaseModel):
    session_id: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    business_name: Optional[str] = None
    cart_items: Optional[List[dict]] = None
    total_amount: Optional[int] = None
    status: Optional[str] = None
    last_step: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    user_id: Optional[str] = None


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return User(**user)


SERVICES_DATA = [
    {
        "id": "trademark-registration",
        "name": "Trademark Registration",
        "description": "Protect your brand identity with official trademark registration",
        "price": 1,
        "features": [
            "Comprehensive trademark search",
            "Application preparation & filing",
            "Government fee assistance",
            "Status tracking & updates",
            "Expert legal consultation"
        ],
        "category": "intellectual-property"
    },
    {
        "id": "gst-registration",
        "name": "GST Registration",
        "description": "Get your business GST compliant with hassle-free registration",
        "price": 1599,
        "features": [
            "Complete documentation support",
            "Application filing",
            "GSTIN within 7 working days",
            "Free GST consultation",
            "Digital certificate delivery"
        ],
        "category": "tax-compliance"
    },
    {
        "id": "company-registration",
        "name": "Company Registration",
        "description": "Register your Private Limited Company with complete legal compliance",
        "price": 1999,
        "features": [
            "Name approval & reservation",
            "MOA & AOA preparation",
            "DIN & DSC for directors",
            "Complete MCA filing",
            "Incorporation certificate",
            "PAN & TAN registration"
        ],
        "category": "business-formation"
    }
]



# ── LEAD / ABANDONED CHECKOUT TRACKING ──────────────────────────────────────

@api_router.post("/leads/upsert")
async def upsert_lead(lead_data: UpsertLeadRequest):
    """
    Called from frontend on every field blur or checkout step change.
    Creates or updates a lead by session_id. No auth required so
    even anonymous visitors are captured.
    """
    now = datetime.now(timezone.utc).isoformat()
    existing = await db.leads.find_one({"session_id": lead_data.session_id}, {"_id": 0})

    update_fields = {"updated_at": now}
    for field in ["name", "email", "phone", "business_name",
                  "cart_items", "total_amount", "last_step",
                  "razorpay_order_id", "user_id"]:
        val = getattr(lead_data, field, None)
        if val is not None:
            update_fields[field] = val

    if lead_data.status:
        update_fields["status"] = lead_data.status

    if existing:
        await db.leads.update_one(
            {"session_id": lead_data.session_id},
            {"$set": update_fields}
        )
        return {"success": True, "lead_id": existing["id"], "action": "updated"}
    else:
        new_lead = AbandonedLead(
            session_id=lead_data.session_id,
            name=lead_data.name,
            email=lead_data.email,
            phone=lead_data.phone,
            business_name=lead_data.business_name,
            cart_items=lead_data.cart_items,
            total_amount=lead_data.total_amount,
            last_step=lead_data.last_step,
            user_id=lead_data.user_id,
            status=LeadStatus(lead_data.status) if lead_data.status else LeadStatus.STARTED,
        )
        doc = new_lead.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        doc["updated_at"] = doc["updated_at"].isoformat()
        await db.leads.insert_one(doc)
        return {"success": True, "lead_id": new_lead.id, "action": "created"}


@api_router.post("/leads/convert/{session_id}")
async def mark_lead_converted(session_id: str):
    """Mark a lead as converted after successful payment."""
    await db.leads.update_one(
        {"session_id": session_id},
        {"$set": {"status": "converted", "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"success": True}


@api_router.get("/leads")
async def get_leads(
    status: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    """
    Admin: view all leads. Add admin check here if needed.
    Filter by status e.g. ?status=partial to see abandoned ones.
    """
    query = {}
    if status:
        query["status"] = status
    leads = await db.leads.find(query, {"_id": 0}).sort("updated_at", -1).to_list(limit)
    return leads


@api_router.get("/")
async def root():
    return {"message": "WebDesert Legal Services API"}


@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone
    )
    
    user_doc = user.model_dump()
    user_doc['password'] = get_password_hash(user_data.password)
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.id})
    return TokenResponse(access_token=access_token, user=user)


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    user_obj = User(**{k: v for k, v in user.items() if k != 'password'})
    access_token = create_access_token(data={"sub": user_obj.id})
    
    return TokenResponse(access_token=access_token, user=user_obj)


@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@api_router.get("/services", response_model=List[Service])
async def get_services():
    return [Service(**service) for service in SERVICES_DATA]


@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    service = next((s for s in SERVICES_DATA if s['id'] == service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return Service(**service)


@api_router.post("/orders/create", response_model=RazorpayOrderResponse)
async def create_order(order_data: CreateOrderRequest, current_user: User = Depends(get_current_user)):
    total_amount = 0
    services = []
    
    for item in order_data.cart_items:
        service = next((s for s in SERVICES_DATA if s['id'] == item.service_id), None)
        if not service:
            raise HTTPException(status_code=404, detail=f"Service {item.service_id} not found")
        
        service_total = service['price']
        if service.get('govt_fee'):
            service_total += service['govt_fee']
        
        total_amount += service_total * item.quantity
        services.append({
            "service_id": service['id'],
            "name": service['name'],
            "price": service['price'],
            "govt_fee": service.get('govt_fee', 0),
            "quantity": item.quantity
        })
    
    discount = 0
    if order_data.coupon_code:
        if order_data.coupon_code.upper() == "LAUNCH50":
            discount = int(total_amount * 0.05)
    
    final_amount = total_amount - discount
    
    try:
        razorpay_order = razorpay_client.order.create({
            "amount": final_amount * 100,
            "currency": "INR",
            "payment_capture": 1
        })
    except Exception as razorpay_error:
        logger.error(f"Razorpay order creation failed: {str(razorpay_error)}")
        raise HTTPException(
            status_code=500,
            detail="Payment gateway unavailable. Please contact support or try again later."
        )
    
    order = Order(
        user_id=current_user.id,
        name=order_data.name,
        email=order_data.email,
        phone=order_data.phone,
        business_name=order_data.business_name,
        services=services,
        total_amount=total_amount,
        discount=discount,
        final_amount=final_amount,
        razorpay_order_id=razorpay_order['id'],
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.CREATED
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    
    await db.orders.insert_one(order_doc)
    
    return {
        "razorpay_order_id": razorpay_order['id'],
        "amount": final_amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "internal_order_id": order.id  # ADD THIS
    }


@api_router.post("/orders/verify-payment")
async def verify_payment(payment_data: VerifyPaymentRequest, current_user: User = Depends(get_current_user)):
    try:
        params_dict = {
            'razorpay_order_id': payment_data.razorpay_order_id,
            'razorpay_payment_id': payment_data.razorpay_payment_id,
            'razorpay_signature': payment_data.razorpay_signature
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        await db.orders.update_one(
            {"id": payment_data.order_id},
            {
                "$set": {
                    "razorpay_payment_id": payment_data.razorpay_payment_id,
                    "payment_status": PaymentStatus.CAPTURED.value,
                    "status": OrderStatus.PROCESSING.value
                }
            }
        )
        
        return {"success": True, "message": "Payment verified successfully"}
    
    except Exception as e:
        await db.orders.update_one(
            {"id": payment_data.order_id},
            {"$set": {"payment_status": PaymentStatus.FAILED.value, "status": OrderStatus.FAILED.value}}
        )
        raise HTTPException(status_code=400, detail="Payment verification failed")


@api_router.get("/orders/my-orders")
async def get_my_orders(current_user: User = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": current_user.id}, {"_id": 0}).to_list(100)
    
    for order in orders:
        if isinstance(order.get('created_at'), str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return orders


@api_router.get("/db-check")
async def db_check():
    try:
        await db.command("ping")
        return {"status": "db connected"}
    except Exception as e:
        return {"error": str(e)}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, current_user: User = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": current_user.id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order.get('created_at'), str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return order


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
