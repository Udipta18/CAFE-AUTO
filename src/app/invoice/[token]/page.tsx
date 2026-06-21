import { notFound } from "next/navigation";
import Image from "next/image";
import { addDays, endOfMonth, startOfMonth } from "date-fns";
import { InvoiceService } from "@/services/invoice.service";
import { InvoiceActions } from "@/components/invoices/invoice-actions";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Heart,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getItemEmoji } from "@/utils/item-icons";
import { STATUS_COLORS, STATUS_LABELS } from "@/constants";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

const BRAND_NAME = "CLICK SIP";
const BRAND_EMAIL = "hello@clicksip.com";
const BRAND_PHONE = "+91 98765 43210";
const BRAND_ADDRESS = "123, Coffee Street, Bengaluru, Karnataka - 560001";

function getInvoiceNumber(token: string) {
  return `#INV-${new Date().getFullYear()}-${token.slice(0, 5).toUpperCase()}`;
}

function getCustomerCode(customerId: string) {
  return `CUS-${customerId.slice(0, 5).toUpperCase()}`;
}

function getRate(amount: string, quantity: number) {
  const total = parseFloat(amount);
  if (!quantity || Number.isNaN(total)) return "0.00";
  return (total / quantity).toFixed(2);
}

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let invoice;
  try {
    invoice = await InvoiceService.getByToken(token);
  } catch {
    notFound();
  }

  const invoiceDate = invoice.createdAt;
  const startDate = startOfMonth(invoiceDate);
  const endDate = endOfMonth(invoiceDate);
  const dueDate = addDays(invoiceDate, 5);
  const invoiceNumber = getInvoiceNumber(invoice.token);
  const customerCode = getCustomerCode(invoice.customerId);

  return (
    <main className="min-h-screen bg-[#f4f4f2] text-[#050505]">
      <Toaster richColors position="top-center" />

      <div className="mx-auto min-h-screen w-full max-w-[1024px] bg-white shadow-2xl">
        <header className="grid min-h-[344px] overflow-hidden border-b border-[#d8d8d8] lg:grid-cols-[1fr_402px]">
          <section className="flex items-center gap-8 px-8 py-10 sm:px-12">
            <Image
              src="/clicksip-logo.png"
              alt="Click Sip logo"
              width={204}
              height={227}
              priority
              className="h-[227px] w-[204px] shrink-0 object-contain"
            />

            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-[52px] font-black leading-none tracking-[0] sm:text-[58px]">
                {BRAND_NAME}
              </h1>
              <p className="mt-5 text-[22px] uppercase tracking-[0]">
                Cafe & refreshments
              </p>

              <div className="mt-7 grid gap-4 text-[15px]">
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span>{BRAND_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 shrink-0" />
                  <span>{BRAND_PHONE}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>{BRAND_EMAIL}</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="relative bg-[#ffc400] px-8 py-9 text-black sm:px-12 lg:pl-[118px]">
            <div className="absolute inset-y-0 left-[-58px] hidden w-[118px] -skew-x-[16deg] bg-white lg:block" />
            <div className="relative">
              <h2 className="text-[50px] font-black uppercase leading-none tracking-[0]">
                Invoice
              </h2>
              <div className="mt-3 inline-flex rounded-md bg-black px-4 py-2 text-[22px] font-black text-white">
                {invoiceNumber}
              </div>

              <dl className="mt-8 grid gap-5 text-[18px] leading-tight">
                <div className="grid grid-cols-[25px_1fr] gap-4">
                  <CalendarDays className="mt-0.5 h-5 w-5" />
                  <div>
                    <dt>Date</dt>
                    <dd className="mt-2">{formatDate(invoiceDate)}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] gap-4">
                  <User className="mt-0.5 h-5 w-5" />
                  <div>
                    <dt>Customer ID</dt>
                    <dd className="mt-2">{customerCode}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] gap-4">
                  <FileText className="mt-0.5 h-5 w-5" />
                  <div>
                    <dt>Invoice For</dt>
                    <dd className="mt-2">
                      {formatDate(startDate)} - {formatDate(endDate)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </aside>
        </header>

        <div className="space-y-[32px] px-[46px] py-[34px]">
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="min-h-[275px] rounded-xl border border-[#d9d9d9] p-5">
              <div className="mb-7 flex items-center gap-3">
                <User className="h-6 w-6" />
                <h2 className="text-[20px] font-black uppercase">Billed To</h2>
              </div>
              <div className="space-y-7">
                <p className="text-[22px] font-black">{invoice.customerName}</p>
                <div className="flex items-center gap-4 text-[17px]">
                  <Phone className="h-5 w-5" />
                  <span>{invoice.customerPhone}</span>
                </div>
              </div>
            </div>

            <div className="min-h-[275px] overflow-hidden rounded-xl border border-[#d9d9d9]">
              <div className="flex items-center gap-3 border-b border-[#e5e5e5] px-6 py-5">
                <ListChecks className="h-6 w-6" />
                <h2 className="text-[20px] font-black uppercase">
                  Invoice Summary
                </h2>
              </div>
              <dl className="divide-y divide-[#e5e5e5] text-[16px]">
                <div className="grid grid-cols-2 px-6 py-4">
                  <dt>Start Date</dt>
                  <dd>{formatDate(startDate)}</dd>
                </div>
                <div className="grid grid-cols-2 px-6 py-4">
                  <dt>End Date</dt>
                  <dd>{formatDate(endDate)}</dd>
                </div>
                <div className="grid grid-cols-2 px-6 py-4">
                  <dt>Due Date</dt>
                  <dd>{formatDate(dueDate)}</dd>
                </div>
                <div className="grid grid-cols-2 items-center px-6 py-4">
                  <dt>Status</dt>
                  <dd>
                    <Badge
                      className={`${STATUS_COLORS[invoice.status]} rounded-lg px-5 py-1.5 text-[13px] font-black uppercase`}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#e0e0e0]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-[16px]">
                <thead className="bg-[#ffc400] text-black">
                  <tr>
                    <th className="w-[76px] px-8 py-[17px] font-black">#</th>
                    <th className="px-4 py-[17px] font-black">ITEM</th>
                    <th className="px-4 py-[17px] text-center font-black">
                      QTY
                    </th>
                    <th className="px-4 py-[17px] text-right font-black">
                      RATE (₹)
                    </th>
                    <th className="px-10 py-[17px] text-right font-black">
                      AMOUNT (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-dashed border-[#dcdcdc] last:border-b-0"
                    >
                      <td className="px-8 py-[18px]">{index + 1}</td>
                      <td className="px-4 py-[18px]">
                        <div className="flex items-center gap-7">
                          <span className="text-[28px] leading-none">
                            {getItemEmoji(item.itemName)}
                          </span>
                          <span className="text-[18px]">{item.itemName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-[18px] text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-[18px] text-right">
                        {getRate(item.amount, item.quantity)}
                      </td>
                      <td className="px-10 py-[18px] text-right">
                        {parseFloat(item.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-9 lg:grid-cols-[1fr_0.98fr]">
            <div className="min-h-[194px] rounded-xl border border-[#dedede] p-6">
              <div className="mb-4 flex items-center gap-4">
                <ClipboardList className="h-6 w-6" />
                <h2 className="text-[20px] font-black uppercase">Note</h2>
              </div>
              <div className="ml-10 space-y-3 text-[16px]">
                <p>Thank you for choosing Click Sip.</p>
                <p>We truly appreciate your business!</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#dedede] text-[18px]">
              <dl>
                <div className="grid grid-cols-2 px-8 py-3">
                  <dt>Subtotal</dt>
                  <dd className="text-right">{formatCurrency(invoice.total)}</dd>
                </div>
                <div className="grid grid-cols-2 px-8 py-3">
                  <dt>Discount</dt>
                  <dd className="text-right">{formatCurrency(0)}</dd>
                </div>
                <div className="grid grid-cols-2 bg-[#fff4cf] px-8 py-3">
                  <dt>Total</dt>
                  <dd className="text-right">{formatCurrency(invoice.total)}</dd>
                </div>
                <div className="grid grid-cols-2 bg-[#ffc400] px-8 py-4 text-[26px] font-black">
                  <dt>TOTAL</dt>
                  <dd className="text-right">{formatCurrency(invoice.total)}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="grid gap-6 rounded-xl border border-[#ffc400] bg-[#fffaf0] p-7 lg:grid-cols-[0.85fr_1.55fr] lg:items-center">
            <div className="text-center lg:border-r lg:border-[#ffc400] lg:pr-8">
              <p className="font-serif text-[42px] italic leading-none">
                Thank you!
              </p>
              <p className="mt-4 text-[18px] leading-7">
                Please review the invoice
                <br />
                and confirm.
              </p>
            </div>
            <div className="space-y-4">
              <InvoiceActions token={invoice.token} status={invoice.status} />
              <p className="flex items-center justify-center gap-2 text-[14px] text-neutral-600">
                <Lock className="h-4 w-4" />
                This link is secure and unique to you.
              </p>
            </div>
          </section>
        </div>

        <footer className="border-t-2 border-black bg-[#ffc400] px-6 py-5 text-center text-[17px]">
          Brewed with <Heart className="mx-1 inline h-5 w-5 fill-black" /> at
          Click Sip Cafe
        </footer>
      </div>
    </main>
  );
}
