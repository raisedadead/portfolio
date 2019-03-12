import { getHelloString } from '../hello'

describe(`server-side hello function`, () =>
	it(`says hello`, () => {
        const tmp = JSON.parse(getHelloString())
        expect(tmp.message).toContain(`Hello, World! `)
	})
)
