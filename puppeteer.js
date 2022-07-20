const puppeteer = require('puppeteer');

let count = 0;
let countFailed = 0;

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: [
			'--disable-web-security',
			'--disable-features=IsolateOrigins,site-per-process'
		]
	})
	const page = await browser.newPage()
	
	await page.setViewport({
		width: 1200,
		height: 700
	})

	await page.goto('http://0.0.0.0:6043')

	while (true) {
		await page.waitForSelector('#btn')
		await page.waitForTimeout(5000)
		await page.click('#btn')
		await page.waitForTimeout(5000)
		const iframe = await (await page.waitForSelector('.chaport-inner-iframe')).contentFrame()
		const indicator = await iframe.waitForSelector('.activity-indicator')
		await page.waitForTimeout(500)
		const visible = await page.$eval('.chaport-inner', e => !!e.getAttribute('style'))
		const failed = (await iframe.$$('.message-body')).length === 0
		if (visible) {
			count++
		}
		if (visible && failed) {
			countFailed++
		}
		if (visible) {
			console.log(`${countFailed}/${count}`)
		}
		await page.reload()
	}
})()

