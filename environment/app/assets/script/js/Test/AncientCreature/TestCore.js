export var ResultMode;
(function (ResultMode) {
    ResultMode[ResultMode["Success"] = 0] = "Success";
    ResultMode[ResultMode["Fail"] = 1] = "Fail";
    ResultMode[ResultMode["Unknown"] = 2] = "Unknown";
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
