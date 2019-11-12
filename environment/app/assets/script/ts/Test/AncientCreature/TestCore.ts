export enum ResultMode {
    Success, Fail, Unknown
}

export class UnitTestResult {
    public resultedBy = ResultMode.Unknown;
    public resultTimeMS: number;
    public intent: string;
    public runResult: any;
    public expectedResult: any;
    public exceptionMessage: string;
    public get resultedByWithText() {
       return ResultMode[this.resultedBy].toString();
    }
}

export class UnitTester {
    public static test(

        intention: string,
        expectedResult: any,
        init: () => GenericObject<any>,

        run: (this: GenericObject<any>) => Object | Array<any> | string | number,
        assertion: (runResult : Object | Array<any> | string | number ,expectedResult : Object | Array<any> | string | number) => boolean,
        initEnvironment: GenericObject<any>): UnitTestResult {


        let runResult : Object | Array<any> | string | number = null;
        let testResult = new UnitTestResult();
        testResult.intent = intention;

        if (init != null)
            initEnvironment = init();
        else
            if (initEnvironment == null)
                console.error("Teste devam edebilmek için Init fonksiyonu ya da Init ile oluşan çevreden biri tanımlanmalıdır.");
        if (initEnvironment) {
            let startt = new Date();

            try {
                runResult = run.bind(initEnvironment)();
                testResult.runResult = runResult;
            }
            catch (ex) {
                testResult.resultedBy = ResultMode.Fail;
                testResult.exceptionMessage = ex.message;
            }

           
            let endt = new Date();

            let elapsed = endt.getMilliseconds() - startt.getMilliseconds();

            testResult.resultTimeMS = elapsed;
            testResult.resultedBy = assertion(runResult, expectedResult) ? ResultMode.Success : ResultMode.Fail;
            testResult.expectedResult = expectedResult;
            return testResult;
        }


    }
}