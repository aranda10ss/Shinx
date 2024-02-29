if (!process.env.TOKEN) {
  console.warn('[-] No token provided. Exiting...')
  process.exit()
}

if (!process.env.PREFIX) {
  console.warn('[!] Prefix not given I will use by default !')
}

if (!process.env.CGPT_KEY) {
  console.warn('[-] No CGPT_KEY provided. Exiting...')
  process.exit()
}

if (!process.env.DATABASE_URL) {
  console.warn('[!] DATABASE_URL not given I will use by default')
  process.env.DATABASE_URL = 'file:./dev.db'
}
