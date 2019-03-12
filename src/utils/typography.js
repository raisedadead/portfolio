import Typography from 'typography'
import gray from 'gray-percentage'

const typography = new Typography(
	{
		baseFontSize: `18px`,
		baseLineHeight: 1.62,
		googleFonts: [
			{
				name: `Poppins`,
				styles: [`100`,`200`,`400`,`300`,`500`,`600`,`700`],
			}
		],
		bodyFontFamily: [
			`Poppins`,
			`sans-serif`,
		],
		scaleRatio: 2.66,
		bodyWeight: 300,
		headerWeight: 600,
		boldWeight: `bold`,
		overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
			body: {
				color: gray(23, `warm`),
			},
			blockquote: {
				...scale(1 / 4),
				borderLeft: `${rhythm(1 / 6)} solid #eceeef`,
				paddingTop: rhythm(1 / 3),
				paddingBottom: rhythm(1 / 3),
				paddingLeft: rhythm(2 / 3),
				paddingRight: rhythm(2 / 3),
			},
			'blockquote > :last-child': {
				marginBottom: 0,
			},
			'blockquote cite': {
				...adjustFontSizeTo(options.baseFontSize),
				color: gray(54, `204`),
				fontWeight: options.bodyWeight,
				fontStyle: `normal`,
			},
			'code.block': {
				backgroundColor: gray(95, `204`),
				display:`block`,
				marginBottom: rhythm(2),
				padding: rhythm(1),
			},
			h1: scale(4 / 4),
			h2: scale(3 / 4),
			h3: scale(2 / 4),
			h4: scale(1 / 6),
			h5: scale(-1 / 6),
			h6: scale(-2 / 6),
		})
	}
)

export default typography
export const rhythm = typography.rhythm
