// Skip Husky install in production and CI
if (process.env.ENV === 'production' || process.env.CI === 'true') {
    process.exit(0)
}
const husky = (await import('husky')).default
console.log(husky())