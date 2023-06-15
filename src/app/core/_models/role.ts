export enum Role {
    EditProject = 'BEWERK_PROJECT',
    CreateProject = 'AANMAAK_PROJECT',
    ExportProject = 'EXPORT_PROJECT',
    CreateFishingPoint = 'AANMAAK_VISPUNT',
    CreateFishingPointWithoutPointOnMap = 'AANMAAK_VISPUNT_LOS',
    CreateSurveyEvent = 'AANMAAK_WAARNEMING',
    EditSurveyEvent = 'BEWERK_WAARNEMING',
    ValidateSurveyEvent = 'VALIDEER_WAARNEMING',
    DeleteSurveyEvent = 'VERWIJDER_WAARNEMING',
    EditCpueParameters = 'BEWERK_CPUE_PARAMETERS',
    CreateMeasurements = 'AANMAKEN_METINGEN',
    DeleteMeasurement = 'VERWIJDER_METING',
    EditMethod = 'BEWERK_METHODE',
    UserAdmin = 'GEBRUIKER_ADMIN',
    CreateImportfile = 'AANMAKEN_IMPORTBESTAND',
    ReadImportfiles = 'RAADPLEGEN_IMPORTBESTAND',
    EditIndexType = 'BEWERK_INDEX_TYPE'
}
