CREATE PROC Usp_MoMs
AS
SET NOCOUNT ON

SELECT 
Id = CodeId
, MoM  = CodeDesc
FROM CYGNUS_Master_General
WHERE
CodeType = 'MOMTYP'

GO