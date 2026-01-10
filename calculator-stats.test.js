describe('HP-12C statistics', () => {
	beforeAll(() => {
		jest.spyOn(console, 'log').mockImplementation(() => {});

		// calculator.js is a browser script. For this test, stub the minimal
		// globals it expects so it can initialize window.calculator.
		global.window = {};
		global.localStorage = {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {},
			clear: () => {},
		};
		const stubEl = {
			textContent: '',
			innerHTML: '',
			style: {},
			className: '',
			classList: {
				add: () => {},
				remove: () => {},
				toggle: () => {},
				contains: () => false,
			},
			setAttribute: () => {},
			getAttribute: () => null,
			querySelectorAll: () => [],
			querySelector: () => null,
			appendChild: () => {},
			remove: () => {},
		};

		global.document = {
			addEventListener: (eventName, handler) => {
				if (eventName === 'DOMContentLoaded') {
					handler();
				}
			},
			querySelectorAll: () => [],
			getElementById: () => stubEl,
			createElement: () => ({ ...stubEl }),
		};

		// Load the browser script and let it create window.calculator.
		require('./calculator.js');
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('g x̄,w computes weighted mean for FAQ example', () => {
		const calc = window.calculator;
		expect(calc).toBeTruthy();

		// Reset state
		calc.stack = [0, 0, 0, 0];
		calc.memory = new Array(20).fill(0);
		calc.stats = [];
		calc.isTyping = false;

		// Data entry as documented in faq-data.json:
		// value ENTER weight Σ+  (score, weight)
		// With Σ+ using x from X and y from Y, this produces x=weight, y=score.
		const add = (score, weight) => {
			calc.stack[0] = weight; // X
			calc.stack[1] = score;  // Y
			calc.isTyping = false;
			calc.sigmaPlus();
		};

		add(85, 3);
		add(90, 2);
		add(78, 1);

		calc.meanWeighted();

		// Expected weighted mean = (85*3 + 90*2 + 78*1) / (3+2+1) = 85.5
		expect(calc.getX()).toBeCloseTo(85.5, 10);
	});
});
