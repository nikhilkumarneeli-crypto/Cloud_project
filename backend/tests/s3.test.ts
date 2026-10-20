import { describe, it, expect } from 'vitest';
import { adminService } from '../src/services/adminService';

describe('Issue 8: Amazon S3 Presigned Uploads & Media Storage Test Suite', () => {
  it('1. should generate a presigned PUT URL for valid image types', async () => {
    const result = await adminService.generatePresignedUpload('product-hero.jpg', 'image/jpeg');
    expect(result.uploadUrl).toBeDefined();
    expect(result.uploadUrl).toContain('https://');
    expect(result.uploadUrl).toContain('canopy-assets-218862656675-us-east-1');
    expect(result.key).toContain('products/');
    expect(result.key).toContain('product-hero.jpg');
    expect(result.publicUrl).toBe(`https://canopy-assets-218862656675-us-east-1.s3.us-east-1.amazonaws.com/${result.key}`);
  });

  it('2. should sanitize special characters in file names', async () => {
    const result = await adminService.generatePresignedUpload('evil & bad;name <script>.png', 'image/png');
    expect(result.key).not.toContain('&');
    expect(result.key).not.toContain('<');
    expect(result.key).not.toContain('>');
    expect(result.key).not.toContain(';');
    expect(result.key).toContain('evil___bad_name__script_.png');
  });

  it('3. should reject unsupported file MIME types', async () => {
    await expect(
      adminService.generatePresignedUpload('script.sh', 'application/x-sh')
    ).rejects.toThrow(/not supported/);

    await expect(
      adminService.generatePresignedUpload('malware.exe', 'application/x-msdownload')
    ).rejects.toThrow(/not supported/);
  });
});
