import { IProgram } from './IProgram';
import { User } from './IUser';
export interface ChangeLogEditorConfig {
    user: User;
    programs: IProgram[];
}