from fastapi import FastAPI
from beanscounter.api.routers.invoices import router as invoices_router

app = FastAPI()
app.include_router(invoices_router)
