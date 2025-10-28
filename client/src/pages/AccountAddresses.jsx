// client/src/pages/AccountAddresses.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import apiClient from '../api/apiClient';
import { Button, Form, InputGroup, Alert } from 'react-bootstrap';

const AccountAddresses = () => {
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // สำหรับ Error/Success

  // ฟังก์ชันดึงที่อยู่
  const fetchAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/users/getAddress?email=${encodeURIComponent(user)}`);
      setAddresses(response.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setMessage('Failed to load addresses.');
    }
    setLoading(false);
  };

  // ดึงที่อยู่เมื่อ Component โหลด
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // ฟังก์ชันเพิ่มที่อยู่
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setMessage('Please enter an address.');
      return;
    }
    try {
      await apiClient.post('/users/addAddress', { email: user, address: newAddress });
      setNewAddress('');
      setMessage('Address added successfully!');
      fetchAddresses(); // โหลดใหม่
    } catch (error) {
      setMessage(error.response?.data?.status || 'Failed to add address.');
    }
  };

  // ฟังก์ชันลบที่อยู่
  const handleRemoveAddress = async (index) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await apiClient.post('/users/removeAddress', { email: user, index: parseInt(index) });
        setMessage('Address removed.');
        fetchAddresses(); // โหลดใหม่
      } catch (error) {
        setMessage(error.response?.data?.status || 'Failed to remove address.');
      }
    }
  };

  return (
    <div className="my-account-content account-address">
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      
      {/* ฟอร์มเพิ่มที่อยู่ */}
      <Form onSubmit={handleAddAddress} className="mb-4">
        <InputGroup className="mb_20">
          <Form.Control
            type="text"
            id="new-address"
            placeholder="New address..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <Button 
            type="submit"
            id="add-address-btn"
            className="tf-btn btn-fill"
            disabled={loading}
          >
            <span>Add</span>
          </Button>
        </InputGroup>
      </Form>

      {/* รายการที่อยู่ */}
      <div id="address-list">
        {loading ? (
          <p>Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p>No addresses found.</p>
        ) : (
          addresses.map((addr, index) => (
            <div key={index} className="mb_10 border p-3 d-flex justify-content-between align-items-center">
              <p className="m-0">{addr}</p>
              <Button
                variant="outline-danger"
                size="sm"
                className="remove-address tf-btn btn-sm btn-outline"
                onClick={() => handleRemoveAddress(index)}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountAddresses;