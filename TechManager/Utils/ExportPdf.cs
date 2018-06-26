using Spire.Pdf;
using Spire.Pdf.HtmlConverter;
using System;
using System.IO;
using System.Threading;
using System.Web.Hosting;
using System.Xml.Linq;
using System.Xml.Xsl;

namespace TechManager.GenerationLogic
{
    public class ExportPdf
    {
        public string GeneratePdf(XElement element, string xsltFileName, PdfPageSettings setting, string endDateTime, string subCtrName)
        {   
            string file_name = GetTempFilePathWithExtension(string.Format("{0}_{1}{2}", endDateTime.ToString(), subCtrName.ToString(), ".pdf"));

            try
            {
                XslCompiledTransform _transform = new XslCompiledTransform(false);
                _transform.Load(Path.Combine(HostingEnvironment.ApplicationPhysicalPath, @"App_Data", xsltFileName));

                using (StringWriter sw = new StringWriter())
                {
                    _transform.Transform(new XDocument(element).CreateReader(), new XsltArgumentList(), sw);

                    using (PdfDocument pdf = new PdfDocument())
                    {
                        PdfHtmlLayoutFormat htmlLayoutFormat = new PdfHtmlLayoutFormat() { IsWaiting = false };                        

                        Thread thread = new Thread(() => pdf.LoadFromHTML(sw.ToString(), false, setting, htmlLayoutFormat));
                        thread.SetApartmentState(ApartmentState.STA);
                        thread.Start();
                        thread.Join();

                        pdf.SaveToFile(file_name);
                    }
                }
            }
            catch
            {
                file_name = string.Empty;
            }

            return file_name;
        }

        private string GetTempFilePathWithExtension(string fileFullName)
        {
            var path = @"E:\PDF History"; //TODO change D/E for my and denis PC
            return Path.Combine(path, fileFullName);
        }
    }
}