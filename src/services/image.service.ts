import { InvoiceService } from "@/services/invoice.service";
import { buildInvoiceUrl } from "@/utils/url";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const ImageService = {
  async generateInvoiceImageBuffer(invoiceId: string): Promise<Buffer> {
    const invoice = await InvoiceService.getById(invoiceId);
    const url = buildInvoiceUrl(invoice.token);

    const isLocal = process.env.NODE_ENV === "development";

    let browser;
    if (isLocal) {
      browser = await puppeteer.launch({
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: true,
      });
    } else {
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1200, deviceScaleFactor: 2 });
    
    // Wait until network is idle so fonts and images load
    await page.goto(url, { waitUntil: "networkidle0" });

    // Hide any buttons or elements we don't want in the screenshot
    await page.evaluate(() => {
      const actions = document.querySelector('.space-y-4');
      if (actions) actions.remove();
      
      const toast = document.querySelector('[data-sonner-toaster="true"]');
      if (toast) toast.remove();
    });

    const element = await page.$("main > div.max-w-\\[1024px\\]");
    
    let buffer;
    if (element) {
      const uint8Array = await element.screenshot({ type: "png" });
      buffer = Buffer.from(uint8Array);
    } else {
      const uint8Array = await page.screenshot({ type: "png", fullPage: true });
      buffer = Buffer.from(uint8Array);
    }

    await browser.close();
    return buffer;
  },

  async generateInvoiceImage(invoiceId: string): Promise<string> {
    return `/api/invoice-image?id=${invoiceId}`;
  },
};
