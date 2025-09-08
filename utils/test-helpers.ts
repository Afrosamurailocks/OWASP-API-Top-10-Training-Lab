export interface TestResult {
  suite: string;
  test: string;
  success: boolean;
  error?: string;
}
interface TestCase {
  name: string;
  fn: () => Promise<void> | void;
}
interface TestSuite {
  name: string;
  tests: TestCase[];
}

const suites: TestSuite[] = [];
let currentSuite: TestSuite | null = null;

export function describe(suiteName: string, fn: () => void) {
  const existingSuite = suites.find(s => s.name === suiteName);
  if (existingSuite) {
      currentSuite = existingSuite;
  } else {
      currentSuite = { name: suiteName, tests: [] };
      suites.push(currentSuite);
  }
  fn();
  currentSuite = null;
}

export function it(testName: string, fn: () => Promise<void> | void) {
  if (!currentSuite) {
    throw new Error('`it` must be called inside a `describe` block');
  }
  currentSuite.tests.push({ name: testName, fn });
}

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected: any) {
      const sortedActual = JSON.stringify(actual, Object.keys(actual || {}).sort());
      const sortedExpected = JSON.stringify(expected, Object.keys(expected || {}).sort());
      if (sortedActual !== sortedExpected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined but it was undefined`);
      }
    },
    toHaveProperty(prop: string) {
      if (!actual || !(prop in actual)) {
        throw new Error(`Expected object ${JSON.stringify(actual)} to have property "${prop}"`);
      }
    },
    async toThrow(expectedError?: string | RegExp) {
        let threw = false;
        let errorMessage = '';
        try {
            await actual();
        } catch (e) {
            threw = true;
            errorMessage = (e as Error).message;
        }

        if (!threw) {
            throw new Error('Expected function to throw an error, but it did not.');
        }

        if (expectedError) {
          if (typeof expectedError === 'string' && !errorMessage.includes(expectedError)) {
             throw new Error(`Expected error message "${errorMessage}" to include "${expectedError}"`);
          } else if (expectedError instanceof RegExp && !expectedError.test(errorMessage)) {
             throw new Error(`Expected error message "${errorMessage}" to match regex "${expectedError.toString()}"`);
          }
        }
    }
  };
}

export async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const suitesToRun = [...suites]; // Copy suites to run
  suites.length = 0; // Clear original array for subsequent runs

  for (const suite of suitesToRun) {
    for (const test of suite.tests) {
      try {
        await test.fn();
        results.push({ suite: suite.name, test: test.name, success: true });
      } catch (e) {
        results.push({ suite: suite.name, test: test.name, success: false, error: (e as Error).message });
      }
    }
  }
  return results;
}
