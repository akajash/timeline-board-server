import Project from '../models/project.js';

import puppeteer from 'puppeteer';
import fs from 'fs'
import handlebars from 'handlebars';

const createPDF = async(data, pdfPath, templatePath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Compile the Handlebars template
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);
  
    // Render the HTML with the dynamic variables
    const html = template(data);
    await page.setContent(html);
  
    const pdfOptions = {
      path: pdfPath,
      format: 'A4',
      printBackground: true
    };
  
    // Generate the PDF file and return it as a buffer
    const buffer = await page.pdf(pdfOptions);
    await browser.close();
    return buffer;
}


export const generatePDF = async(req,res) => {
    
    const {id} = req.params
    const projectDetails = Project.find({creator: req.userId, id: id})
    console.log(projectDetails)
    const data = {
        title: 'My Page',
        heading: 'Welcome to My Page',
        content: 'This is the content of my page.'
      };
    const buffer = createPDF(data, './example.pdf', './invoices/template.hbs');
    
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    // res.send(buffer);
}

