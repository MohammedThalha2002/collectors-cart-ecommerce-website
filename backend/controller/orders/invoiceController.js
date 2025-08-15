import path from "path";
import fs from "fs-extra";
import hbs from "handlebars";
import html_to_pdf from "html-pdf-node";
import dotenv from "dotenv";
dotenv.config();

const compile = async function (data) {
  const filePath = path.join(process.cwd(), "template", "invoice.hbs");
  const html = await fs.readFile(filePath, "utf8");

  hbs.registerHelper("returnTotal", (quantity, price, gst) => {
    const gstPerUnit = price * (gst / 100);
    return gstPerUnit * quantity + quantity * price;
  });

  return hbs.compile(html)(data);
};

export const generateInvoice = async (data) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;

  let invoiceData = data;
  invoiceData.orderDate = today;

  try {
    let options = {
      format: "A4",
      border: {
        top: "0.3in",
        right: "0.3in",
        bottom: "0.3in",
        left: "0.3in",
      },
      paginationOffset: 1,
      type: "pdf",
      quality: "75",
      renderDelay: 300,
      height: "11.7in",
      width: "8.27in",
      orientation: "portrait",
      phantomArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
      zoomFactor: 0.8,
    };

    const content = await compile(invoiceData);
    console.log("HBS COMPILED");
    let file = { content: content };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    console.log("PDF GENERATED");

    const fileName = data.orderId + ".pdf";
    const pdfPath = `${process.env.INVOICE_UPLOAD_PATH}/${fileName}`;
    fs.writeFileSync(pdfPath, pdfBuffer);
    return {
      message: "Invoice Saved Successfully",
      url: pdfPath,
    };
  } catch (error) {
    console.log(error);
    return {
      message: "Something went wrong",
      url: null,
    };
  }
};
