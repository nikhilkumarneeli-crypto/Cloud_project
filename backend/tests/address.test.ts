import { describe, it, expect, beforeEach } from 'vitest';
import { addressRepository } from '../src/repositories/addressRepository';
import type { CustomerAddress } from '../src/types';

describe('Issue 6: Address Management & User Data Isolation Test Suite', () => {
  const userA = 'usr-customer-alpha';
  const userB = 'usr-customer-beta';

  const address1: CustomerAddress = {
    id: 'addr-alpha-1',
    fullName: 'Alice Walker',
    phone: '+1 (206) 555-0100',
    street: '123 Pine St',
    apartment: 'Apt 2A',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    isDefault: true
  };

  const address2: CustomerAddress = {
    id: 'addr-alpha-2',
    fullName: 'Alice Office',
    phone: '+1 (206) 555-0101',
    street: '456 Olive Way',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98104',
    country: 'United States',
    isDefault: false
  };

  const addressB: CustomerAddress = {
    id: 'addr-beta-1',
    fullName: 'Bob Martinez',
    phone: '+1 (415) 555-0200',
    street: '789 Market St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'United States',
    isDefault: true
  };

  beforeEach(async () => {
    // Clear userA and userB addresses by saving
    await addressRepository.save(userA, address1);
    await addressRepository.save(userA, address2);
    await addressRepository.save(userB, addressB);
  });

  it('1. should list saved addresses for the authenticated user only', async () => {
    const listA = await addressRepository.listByUser(userA);
    expect(listA.length).toBe(2);
    expect(listA.every((a) => a.fullName.startsWith('Alice'))).toBe(true);

    const listB = await addressRepository.listByUser(userB);
    expect(listB.length).toBe(1);
    expect(listB[0].fullName).toBe('Bob Martinez');
  });

  it('2. should enforce data isolation: User A cannot see User B addresses', async () => {
    const listA = await addressRepository.listByUser(userA);
    const hasBob = listA.some((a) => a.id === addressB.id || a.fullName === 'Bob Martinez');
    expect(hasBob).toBe(false);
  });

  it('3. should update default address status correctly', async () => {
    await addressRepository.setDefault(userA, 'addr-alpha-2');
    const updated = await addressRepository.listByUser(userA);
    const addr1 = updated.find((a) => a.id === 'addr-alpha-1');
    const addr2 = updated.find((a) => a.id === 'addr-alpha-2');

    expect(addr2?.isDefault).toBe(true);
    expect(addr1?.isDefault).toBe(false);
  });

  it('4. should delete address and maintain remaining addresses', async () => {
    await addressRepository.delete(userA, 'addr-alpha-2');
    const remaining = await addressRepository.listByUser(userA);
    expect(remaining.length).toBe(1);
    expect(remaining[0].id).toBe('addr-alpha-1');

    // Ensure User B was unaffected
    const listB = await addressRepository.listByUser(userB);
    expect(listB.length).toBe(1);
  });
});
