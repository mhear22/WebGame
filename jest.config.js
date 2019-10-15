module.exports = {
	transform: {
		"^.+\\.tsx?$": "ts-jest",
		"^.+\\.html?$": "html-loader-jest"
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};