# Appointment CSV Export Validation

On 22 August 2026, the protected administration interface was loaded with two browser-mocked appointment records without writing to the clinic database. After selecting the `confirmed` status and `Retina Services` filters, the live Export CSV action was triggered. The downloaded CSV contained the Mock Retina Patient and excluded the Mock Cataract Patient, proving the export follows the active filtered inbox. The export control is rendered only inside the administrator-only appointment-management component; non-administrator visitors receive the restricted workspace view instead.

The access boundary is also explicitly covered by UI and router tests. A mocked non-administrator receives the restricted appointment workspace without the Export CSV control or request rows, and the protected appointment-list procedure rejects a non-administrator server request. The complete suite passes with these checks in place.
