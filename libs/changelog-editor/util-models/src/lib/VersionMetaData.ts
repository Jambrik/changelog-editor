export interface VersionMetaData {
    version: string | null;
    releaseDate?: Date | null;
    type?: 'PROD' | 'TEST';
}
