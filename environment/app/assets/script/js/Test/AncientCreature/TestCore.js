export var ResultMode;
(function (ResultMode) {
    ResultMode[ResultMode["Fail"] = 0] = "Fail";
    ResultMode[ResultMode["Success"] = 1] = "Success";
    ResultMode[ResultMode["Unknown"] = -1] = "Unknown";
})(ResultMode || (ResultMode = {}));
export class UnitTestResult {
    constructor() {
        this.resultedBy = ResultMode.Unknown;
    }
    get resultedByWithText() {
        return ResultMode[this.resultedBy].toString();
    }
}
export class UnitTester {
    static test(intention, expectedResult, init, run, assertion, initEnvironment) {
        let runResult = null;
        let testResult = new UnitTestResult();
        testResult.intent = intention;
        if (init != null)
            initEnvironment = init();
        else if (initEnvironment == null)
            console.error("Teste devam edebilmek için Init fonksiyonu ya da Init ile oluşan çevreden biri tanımlanmalıdır.");
        if (initEnvironment) {
            let startt = 0;
            let endt = 0;
            try {
                startt = (new Date()).getMilliseconds();
                runResult = run.bind(initEnvironment)();
                endt = (new Date()).getMilliseconds();
                testResult.runResult = runResult;
            }
            catch (ex) {
                endt = (new Date()).getMilliseconds();
                testResult.resultedBy = ResultMode.Fail;
                testResult.exceptionMessage = ex.message;
            }
            let elapsed = endt - startt;
            testResult.resultTimeMS = elapsed;
            testResult.resultedBy = assertion(runResult, expectedResult) ? ResultMode.Success : ResultMode.Fail;
            testResult.expectedResult = expectedResult;
            return testResult;
        }
    }
}
