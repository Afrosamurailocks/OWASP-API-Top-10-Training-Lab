import { runTests } from '../utils/test-helpers';

// Import all test files to register them
import './api.test';

export const runAllTests = async () => {
    // The imported files will have already called describe/it and populated the test suites.
    return await runTests();
};
