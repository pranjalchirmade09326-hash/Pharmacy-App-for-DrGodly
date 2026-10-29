from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.models import PharmacyQRCode, Pharmacy

router = APIRouter(prefix="/qr", tags=["Counter QR Stands"])

@router.get("/stands")
async def list_qr_stands(
    db: AsyncSession = Depends(get_db)
):
    """
    List physical acrylic counter standees and scan analytics.
    """
    result = await db.execute(select(PharmacyQRCode))
    stands = result.scalars().all()
    
    if not stands:
        # Create a default stand
        res_pharm = await db.execute(select(Pharmacy).limit(1))
        pharm = res_pharm.scalars().first()
        pharm_id = pharm.id if pharm else "pharm_default"

        default_stand = PharmacyQRCode(
            pharmacy_id=pharm_id,
            code_identifier="QR-PHARM-DEL-041-COUNTER1",
            counter_label="Main Dispensing Counter 1",
            tel_number="+918069000000",
            scans_count=142,
            is_active=True,
        )
        db.add(default_stand)
        await db.commit()
        await db.refresh(default_stand)
        stands = [default_stand]

    return stands

@router.post("/scan/{identifier}")
async def record_qr_scan(
    identifier: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Record a physical smartphone scan on the counter QR standee.
    """
    result = await db.execute(select(PharmacyQRCode).filter(PharmacyQRCode.code_identifier == identifier))
    stand = result.scalars().first()
    if not stand:
        raise HTTPException(status_code=404, detail="QR Standee not found")

    stand.scans_count += 1
    await db.commit()

    return {
        "status": "SCAN_RECORDED",
        "scans_count": stand.scans_count,
        "tel_action": f"tel:{stand.tel_number}",
        "counter_label": stand.counter_label,
    }
