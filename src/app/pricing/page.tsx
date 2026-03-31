export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      features: [
        '3 thumbnails per month',
        'All 6 styles',
        'HD 1280x720',
        'Basic support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '9.99',
      features: [
        'Unlimited thumbnails',
        'All styles + priority',
        'HD 1920x1080',
        'No watermark',
        'Priority generation',
        'Email support',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '19.99',
      features: [
        'Everything in Pro',
        'API access',
        'Bulk generation',
        'Custom styles',
        'Team accounts',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">
          Simple, Transparent{' '}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Pricing
          </span>
        </h1>
        <p className="text-gray-400 text-center text-lg mb-16">
          Start free. Upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.popular
                  ? 'border-purple-500 bg-purple-500/5 relative'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-sm px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price !== '0' && (
                  <span className="text-gray-400">/month</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'border border-gray-700 hover:border-gray-500'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
