module.exports = {


  friendlyName: 'Update notice',


  description: 'Update a notice',


  inputs: {

    id: {
      type: 'number',
      required: true,
      description: 'notice identifier'
    },

    title: {
      type: 'string',
      required: true,
      description: 'the title of the message'
    },

    message: {
      type: 'string',
      required: true,
      description: 'the message'
    },

    level: {
      type: 'string',
      required: true,
      description: 'level indicator'
    },

    active: {
      type: 'boolean',
      required: true,
      description: 'Indicates if the message is active or not'
    }


  },


  exits: {

  },


  fn: async function (inputs) {

    console.log(`update-notice inputs is ${inputs}`);

    await Notice.update({id: inputs.id}, inputs).fetch();

    // All done.
    return;

  }


};
