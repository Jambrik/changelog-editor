import { IProgram } from './IProgram';
import { User } from './IUser';
export interface IChangeLogEditorConfig {
    user: User;
    programs: IProgram[];
}