export default {
	plugins: ['stylelint-order'],
	rules: {
		'at-rule-empty-line-before': [
			'always',
			{
				ignore: ['after-comment'],
				except: ['blockless-after-same-name-blockless', 'first-nested'],
			},
		],
		'comment-empty-line-before': ['always', { ignore: ['after-comment'], except: ['first-nested'] }],
		'declaration-block-single-line-max-declarations': 1,
		'declaration-property-value-disallowed-list': {
			'/^border/': ['none'], // see https://codepen.io/denilsonsa/pen/LYQwqQ
		},
		'max-nesting-depth': 2,
		'order/order': [
			'custom-properties',
			'declarations',
			{ type: 'at-rule', name: 'supports' },
			{ type: 'at-rule', name: 'media' },
			'rules',
		],
		'rule-empty-line-before': ['always', { ignore: ['after-comment'], except: ['first-nested'] }],
		'selector-max-id': 0,
	},
}
