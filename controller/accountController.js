const InfluencerAccount = require('../models/influencerAccount');

const addAccount = async (req, res) => {
  const { influencer_id, account_name, account_number, bank_name } = req.body;
  try {
    const accountExists = await InfluencerAccount.findOne({
      influencer: influencer_id,
    });
    if (accountExists) {
      return res.status(400).json({
        status: false,
        message: 'Account already exists for this user',
        data: null,
      });
    }
    const newAccount = new InfluencerAccount({
      influencer: influencer_id,
      bank_name: bank_name,
      account_name: account_name,
      account_number: account_number,
    });
    const account = await newAccount.save();
    return res.status(200).json({
      status: true,
      message: 'Account added successfully',
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error with adding account',
      data: null,
    });
  }
};

const editAccount = async (req, res) => {
  const { account_id, bank_name, account_name, account_number } = req.body;
  try {
    const existingAccount = await InfluencerAccount.findById(account_id);
    if (!existingAccount) {
      return res
        .status(400)
        .json({ status: false, message: 'Account not found', data: null });
    }
    existingAccount.bank_name = bank_name;
    (existingAccount.account_name = account_name),
      (existingAccount.account_number = account_number);
    const update = await existingAccount.save();
    return res.status(200).json({
      status: true,
      message: 'Account updated successfully',
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error with updating account',
      data: null,
    });
  }
};

const deleteAccount = async (req, res) => {
  const { account_id } = req.body;

  try {
    const deletedAccount = await InfluencerAccount.findByIdAndDelete(
      account_id
    );
    return res.status(200).json({
      status: true,
      message: 'Account deleted successfully',
      data: deletedAccount,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error with deleting account',
      data: null,
    });
  }
};

const fetchAccount = async (req, res) => {
  const influencer_id = req.params.id;

  try {
    const account = await InfluencerAccount.findOne({
      influencer: influencer_id,
    });
    if (!account) {
      return res
        .status(404)
        .json({ status: false, message: 'Account not found', data: null });
    }
    return res.status(200).json({
      status: true,
      message: 'Account retrieved successfully',
      data: account,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Error with fetching account',
      data: null,
    });
  }
};

module.exports = {
  addAccount,
  editAccount,
  deleteAccount,
  fetchAccount,
};
