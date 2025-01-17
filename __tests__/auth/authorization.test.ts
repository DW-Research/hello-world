import { createTestUser, createMockRequest, createMockResponse } from '../utils/testHelpers';
import { UserRole, Permission } from '../../lib/auth/roles';
import { withPermission } from '../../lib/middleware/permissions';

describe('Authorization', () => {
  it('should allow access with correct permissions', async () => {
    const { user, token } = await createTestUser(UserRole.ADMIN);
    const req = createMockRequest({
      headers: {
        authorization: `Bearer ${token}`,
        'user-id': user.id
      }
    });
    const res = createMockResponse();
    const next = jest.fn();

    const handler = withPermission(Permission.MANAGE_USERS);
    await handler(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should deny access with insufficient permissions', async () => {
    const { user, token } = await createTestUser(UserRole.USER);
    const req = createMockRequest({
      headers: {
        authorization: `Bearer ${token}`,
        'user-id': user.id
      }
    });
    const res = createMockResponse();
    const next = jest.fn();

    const handler = withPermission(Permission.MANAGE_USERS);
    await handler(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
}); 