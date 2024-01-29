const SubscriptionModel = require('../models/Subscription');
const VerifyCompany = require('../models/VerifyCompany');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionModel.find({}, { __v: 0 });
    if (subscriptions) {
      return res.status(200).json({
        status: true,
        message: 'Successfully fetched all the subscription records',
        data: subscriptions,
      });
    }
    // return res.status(200).json({
    //   status: true,
    //   message: 'No subscriptions found',
    //   data: [],
    // });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error retrieving subscriptions',
      data: null,
    });
  }
};

const createNewSubsriptions = async (req, res) => {
  const { price, name, features, color, description } = req.body;
  try {
    const subscriptionExists = await SubscriptionModel.findOne({ name: name });
    if (subscriptionExists) {
      return res.status(400).json({
        status: false,
        message: 'Subscription already exists.',
        data: subscriptionExists,
      });
    }

    const newSubscription = await SubscriptionModel.create({
      price: price,
      name: name,
      color_code: color || 'ffffff',
      features: features,
    });

    return res.status(200).json({
      status: true,
      message: 'Subscription created successfully',
      data: newSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error creating subscription',
      data: null,
    });
  }
};

const deleteSubscriptions = async (req, res) => {
  const { sub_id } = req.body;
  try {
    const deletedSubscription = await SubscriptionModel.findByIdAndDelete(
      sub_id
    );
    console.log({ deletedSubscription });
    if (deletedSubscription) {
      return res.status(200).json({
        status: true,
        message: 'Subscription deleted successfully',
        data: deletedSubscription,
      });
    }
    return res.status(400).json({
      status: false,
      message: 'Subscription not found',
      data: null,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: false,
      message: 'Error with deleting subscription',
      data: null,
    });
  }
};

const editSubscriptions = async (req, res) => {
  const { sub_id, price, name, features, color } = req.body;
  try {
    var subscription = await SubscriptionModel.findByIdAndUpdate(
      sub_id,
      {
        price: price,
        name: name,
        features: features,
        color_code: color,
      },
      {
        returnDocument: 'after',
      }
    ).exec();
    if (!subscription) {
      return res.status(400).json({
        status: true,
        message: 'Subscription not found',
        data: null,
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Subscription edit successful',
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error with editing subscription',
      data: null,
    });
  }
};

const verifySubscription = async (req, res) => {};

const fetchUserSubscription = async (req, res) => {
  const user_id = req.params.id;

  try {
    const company = await VerifyCompany.findOne({ userId: user_id }).populate(
      'subscription'
    );
    if (!company) {
      return res.status(400).json({
        status: false,
        message: 'Could not find company registered',
        data: null,
      });
    }
    const subscriptionData = {
      subscription: company.subscription,
      expires: company.expiry,
    };

    return res.status(200).json({
      status: true,
      message: 'Subscription retrieved successfully',
      data: subscriptionData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error occured while retrieving subscription',
    });
  }
};
module.exports = {
  getAllSubscriptions,
  createNewSubsriptions,
  deleteSubscriptions,
  editSubscriptions,
  verifySubscription,
  fetchUserSubscription,
};
