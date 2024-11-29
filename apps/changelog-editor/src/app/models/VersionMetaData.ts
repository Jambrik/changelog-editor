export interface VersionMetaData {
    version: string;
    releaseDate?: Date;
    type?: 'PROD' | 'TEST';
}
