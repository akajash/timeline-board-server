
import Expense from '../models/expense.js'
import Analytics from '../models/analytics.js'
import Project from '../models/project.js';
import Task from '../models/Tasks.js'

import fastcsv from 'fast-csv'

export const downloadProjects = async(req,res) => {

    const userId = req.userId
    const {startDate,endDate,downloadParameter} = req.body

    

    // switch(downloadParameter.value){
    //     case 1: result = await Project.find({user:userId, dateFrom: {$gte:startDate, $lte: endDate}})
    //             break

    //     case 2: result = await Task.find({creator: userId, createdAt: {$gte:startDate, $lte: endDate}})
    //             break

    //     case 3: result = await Expense.find({user: userId, createdAt: {$gte: startDate, $lte: endDate}})
    //             break
    // }

    var result = await Project.find({user:userId, dateFrom: {$gte:startDate, $lte: endDate}})


    var csvData = []

    csvData.push(['eventName',
    'eventType',
    'eventLocation',
    'primaryContact',
    'secondaryContact',
    'dateFrom',
    'dateTo',
    'package',
    'reference',
    'amountQuoted',
    'amountPaid',
    'email',
    'discount',
    'discount_type',
    'createdAt',
    'additionalNotes',
    'status',...new Set(result.flatMap(obj => obj.services.map((service, index) => `service_${index + 1}`)))])

    
    // res.set('Content-Type', 'text/csv');
    // res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');

    // const ws = res

    // fastcsv.write([header], { headers: false }).pipe(res);
    // ws.write('\n')

    result.forEach(item => {
        if(item.services){
            var header_len = csvData[0].filter(col => col.startsWith('service_')).length
            if(header_len >= item.services.length){
                var serviceValues = []
                item.services.map((s) => {
                    serviceValues.push(`${s.service} x ${s.quantity}`)
                    console.log(s.service)
                })
                
                csvData.push([item.eventName, item.eventType, item.eventLocation,item.primaryContact,item.secondaryContact,item.dateFrom,item.dateTo,item.package,item.reference.title,item.amountQuoted,item.amountPaid,item.email,item.discount,item.discount_type,item.createdAt,item.additionalNotes,item.status, ...serviceValues])

                
                // fastcsv.write(, { headers: false }).pipe(res);
                // ws.write('\n')
            }
            
        // const serviceValues = header.filter(col => col.startsWith('service_')).map(col => item?.services.includes(col.split('_')[1]) ? col.split('_')[1] : '');
        ;
        }
        else{
            csvData.push([item.eventName, item.eventType, item.eventLocation,item.primaryContact,item.secondaryContact,item.dateFrom,item.dateTo,item.package,item.reference.title,item.amountQuoted,item.amountPaid,item.email,item.discount,item.discount_type,item.createdAt,item.additionalNotes,item.status])
            
        }
      });
   

    
    
    
    // const csvData = [];
    // csvData.push(['eventName',
    // 'eventType',
    // 'eventLocation',
    // 'primaryContact',
    // 'secondaryContact',
    // 'dateFrom',
    // 'dateTo',
    // 'package',
    // 'reference',
    // 'amountQuoted',
    // 'amountPaid',
    // 'email',
    // 'discount',
    // 'discount_type',
    // 'createdAt',
    // 'additionalNotes',
    // 'status']);

    // if(result.services){
    // const flattenedDataHeader = csvData.concat(result?.services?.map((service,index) => `service_${index+1}`))
    // console.log(flattenedDataHeader)
    // }

    
    

    // result.forEach((item) => {
    //   csvData.push([item.eventName, item.eventType, item.eventLocation,item.primaryContact,item.secondaryContact,item.dateFrom,item.dateTo,item.package,item.reference.title,item.amountQuoted,item.amountPaid,item.email,item.discount,item.discount_type,item.createdAt,item.additionalNotes,item.status]);
    // });

    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');
    fastcsv.write(csvData, { headers: true }).pipe(res);

    // res.status(200).end(csvData)

}


export const downloadTasks = async(req,res) => {
    const userId = req.userId
    const {startDate,endDate} = req.body

    try{
        var result = await Task.find({creator: userId, createdAt: {$gte:startDate, $lte: endDate}})
        var csvData = []
        csvData.push(['job_title',
        'description',
        'allocated_to',
        'deadline',
        'status',
        'createdAt'])

        

        result.forEach(item => {
            
            csvData.push([item.job_title, item.description, item.allocated_to.name,item.deadline,item.status,item.createdAt])
                
            });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');
        fastcsv.write(csvData, { headers: true }).pipe(res);

    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}


export const downloadExpenses = async(req,res) => {
    const userId = req.userId
    const {startDate,endDate} = req.body

    try{
        var result = await Expense.find({user: userId, createdAt: {$gte:startDate, $lte: endDate}})
        var csvData = []
        csvData.push(['Title',
            'Amount',
            'createdAt'])


        result.forEach(item => {
            // var projectName= Project.find({user:userId,_id:item.order_id})
            // console.log(projectName[0])
            csvData.push([item.title, item.amount,item.createdAt])
                
            });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');
        fastcsv.write(csvData, { headers: true }).pipe(res);

    }
    catch(error){
        res.status(409).json({message: error.message})
    }
}

export const tasksByProject = async(req,res) => {
    const userId = req.userId
    const {id} = req.params 

    const tasks = await Task.find({creator: userId, projectId: id})

    var csvData = []
        csvData.push(['job_title',
        'description',
        'allocated_to',
        'deadline',
        'status',
        'createdAt'])

        

        tasks.forEach(item => {
            
            csvData.push([item.job_title, item.description, item.allocated_to.name,item.deadline,item.status,item.createdAt])
                
            });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');
        fastcsv.write(csvData, { headers: true }).pipe(res);
    
}


export const expensesByProject = async(req,res) => {
    const userId = req.userId
    const {id} = req.params 

    const expenses = await Expense.find({user: userId, order_id: id})

    var csvData = []
        csvData.push(['Title',
            'Amount',
            'createdAt'])


    expenses.forEach(item => {
        
        csvData.push([item.title, item.amount,item.createdAt])
            
        });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment: filename="data.csv"');
    fastcsv.write(csvData, { headers: true }).pipe(res);
    
}