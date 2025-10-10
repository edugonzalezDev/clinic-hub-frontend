# Como usarlo

```tsx
// p.ej. en PatientDetailPage.tsx (o donde listes los docs)
import { openCertificatePdf, openPrescriptionPdf } from "@/features/medical/pdfActions";

// ...
<Button variant="outline" onClick={() => openCertificatePdf(cert)}>
  Ver certificado
</Button>

<Button variant="outline" onClick={() => openPrescriptionPdf(rx)}>
  Ver receta
</Button>
```
