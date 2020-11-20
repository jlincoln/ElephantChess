module.exports = {


  friendlyName: 'Create notice',


  description: 'Create a notice',


  inputs: {

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

    let notice = await Notice.create(inputs); 

    // All done.
    return;

  }


};
