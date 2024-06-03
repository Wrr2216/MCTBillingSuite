var express = require('express');
var router = express.Router();
const Project = require('../models/projects');
const Comment = require('../models/comments');
const stripe = require('../config/stripe');

// Helper function to format dates to YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

/* GET projects page. */
router.get('/', async function(req, res, next) {
  const projects = await Project.findAll();

    if(req.session.user){
        res.render('projects/projects_overview', {user: req.session.user, projects: projects});
    }else{
        res.redirect('/');
    }
});

router.get('/:id/details', async (req, res) => {
    try {
      const project = await Project.findProjectById(req.params.id);
      const comments = await Comment.findCommentsByProjectId(req.params.id);
      
      if(project != null){
        project.startDate = formatDate(project.startDate);
        project.projectedEndDate = formatDate(project.projectedEndDate);
        project.endDate = formatDate(project.endDate);
        res.render('projects/project_details', {user: req.session.user, project: project, comments: comments});
      }

    } catch (error) {
      console.error(error);
    }
  });

// Add a comment
router.post('/:id/comments', async (req, res) => {
    try {
        await Comment.createComment(req.params.id, req.session.user.id, req.body.text, new Date());
        await Project.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
        res.redirect(`/projects/${req.params.id}/details`);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/create', async (req, res) => {
    if(req.session.user){
        res.render('projects/project_add', {user: req.session.user});
    }else{
        res.redirect('/');
    }
});

router.post('/create', async (req, res) => {
  try {
    const newProject = {
      name: req.body.name,
      description: req.body.description,
      client: req.body.client,
      clientEmail: req.body.clientEmail,
      clientPhone: req.body.clientPhone,
      startDate: req.body.startDate,
      projectedEndDate: req.body.projectedEndDate,
      endDate: req.body.endDate,
      status: req.body.status,
      estimatedCost: req.body.estimatedCost,
      actualCost: req.body.actualCost,
      estimatedRevenue: req.body.estimatedRevenue,
      actualRevenue: req.body.actualRevenue,
      hoursWorked: req.body.hoursWorked,
      hourlyRate: req.body.hourlyRate,
      projectRate: req.body.projectRate,
    };

    const createdProject = await Project.create(newProject);

    console.log(`Created project: ${JSON.stringify(createdProject)}`);

    res.redirect(`/projects/${createdProject.id}/details`);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Save project changes
router.post('/:id/save', async (req, res) => {
  try {
      const projectId = req.params.id;
      const updatedData = {
          name: req.body.name,
          description: req.body.description,
          client: req.body.client,
          clientEmail: req.body.clientEmail,
          clientPhone: req.body.clientPhone,
          startDate: req.body.startDate,
          projectedEndDate: req.body.projectedEndDate,
          endDate: req.body.endDate,
          status: req.body.status,
          estimatedCost: req.body.estimatedCost,
          actualCost: req.body.actualCost,
          estimatedRevenue: req.body.estimatedRevenue,
          actualRevenue: req.body.actualRevenue,
          hoursWorked: req.body.hoursWorked,
          hourlyRate: req.body.hourlyRate,
          projectRate: req.body.projectRate
      };

      await Project.updateProject(projectId, updatedData);
      res.redirect(`/projects/${projectId}/details`);
  } catch (error) {
      console.error('Error saving project details:', error);
      res.status(500).json({ error: 'Error saving project details' });
  }
});

// Delete project
router.get('/:id/delete', async (req, res) => {
  try {
    const projectId = req.params.id;

    // Delete related comments first
    await Comment.destroy({
      where: {
        projectId: projectId
      }
    });

    // Delete the project
    await Project.destroy({
      where: {
        id: projectId
      }
    });

    res.redirect('/projects');
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Generate Stripe Invoice
router.post('/:id/generate-invoice', async (req, res) => {
  /*try {
    const project = await Project.findProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create a new customer in Stripe or retrieve existing customer ID
    const customer = await stripe.customers.create({
      name: project.client,
      email: req.body.email, // Pass the client's email from the request body
      phone: req.body.phone // Pass the client's phone number from the request body
    });

    // Log customer creation details
    console.log(`Created customer: ${JSON.stringify(customer)}\n`);

   // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: true // Auto-finalize this draft after ~1 hour
    });

   // Create an invoice item
   const invoiceItem = await stripe.invoiceItems.update({
      customer: customer.id,
      quantity: project.hoursWorked,
      currency: 'usd',
      description: `Labor - IT`,
      invoice: invoice.id
    });


    // Log invoice item creation details
    console.log(`Created invoice item: ${JSON.stringify(invoiceItem)}\n`);

 

    // Log invoice creation details
    console.log(`Created invoice: ${JSON.stringify(invoice)}\n`);

    res.json({ invoiceUrl: invoice.hosted_invoice_url });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generating invoice', details: error.message });
  }*/
});

module.exports = router;