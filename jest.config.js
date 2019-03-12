module.exports = {
	globals: {
		__PATH_PREFIX__: '',
	},
	moduleNameMapper: {
		'.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
		'.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
	},
	setupFiles: ['<rootDir>/jest-loadershim.js'],
	testPathIgnorePatterns: ['node_modules', '.cache'],
	testRegex: '/.*(__tests__\\/.*)|(.*(test|spec))\\.jsx?$',
	testURL: 'http://localhost',
	transform: {
		'^.+\\.jsx?$': '<rootDir>/jest-preprocess.js',
	},
	transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
}
