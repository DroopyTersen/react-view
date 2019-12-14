declare const theme: {
    plain: {
        fontSize: string;
        color: string;
        backgroundColor: string;
        fontFamily: string;
        margin: number;
    };
    styles: ({
        types: string[];
        style: {
            color: string;
            backgroundColor?: undefined;
        };
    } | {
        types: string[];
        style: {
            color?: undefined;
            backgroundColor?: undefined;
        };
    } | {
        types: string[];
        style: {
            color: string;
            backgroundColor: string;
        };
    })[];
};
export default theme;
