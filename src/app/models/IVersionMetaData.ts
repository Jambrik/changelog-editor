export interface IVersionMetaData {
    version: string;
    releaseDate?: Date;
    type?: "PROD" | "TEST";
}