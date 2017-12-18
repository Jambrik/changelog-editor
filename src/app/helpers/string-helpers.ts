export class StringHelpers {
    public static sortAsc = (a: any, b: any) {
        if(a<b){
            return -1;
        } else if(a==b){
            return 0;
        } else {
            return 1;
        }
    }

    public static sortDesc = (a: any, b: any) {
        if(a<b){
            return 1;
        } else if(a==b){
            return 0;
        } else {
            return -1;
        }
    }
}