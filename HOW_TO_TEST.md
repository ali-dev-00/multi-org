# How to Test the Multi-Organization Contacts Application

This guide provides step-by-step instructions to test all functionality and verify the application meets the requirements.

## Prerequisites

Before testing, ensure you have:
- ✅ Application running (`php artisan serve` + `npm run dev`)
- ✅ Database migrated and seeded (`php artisan migrate --seed`)
- ✅ Storage linked (`php artisan storage:link`)
- ✅ Health check working (`GET /healthz` returns `{ "ok": true }`)

## Login Credentials

**Default Users (created by seeder):**
- **Admin**: `admin@example.com` / `password`
- **Member**: `member@example.com` / `password`

## Testing Checklist

### 1. Authentication & Basic Setup ✅
- [ ] Access `/healthz` → Should return `{ "ok": true }`
- [ ] Login with admin credentials → Should redirect to dashboard
- [ ] Login with member credentials → Should redirect to dashboard
- [ ] Logout functionality works

### 2. Organization Management ✅
- [ ] Create new organization
- [ ] Organization switcher works
- [ ] Session persistence (refresh page, org selection maintained)
- [ ] Role assignment (creator becomes Admin)

### 3. Contact Management ✅
- [ ] Create new contact
- [ ] View contact list (scoped to current org)
- [ ] Edit contact details
- [ ] Delete contact
- [ ] Avatar upload and display
- [ ] Search functionality (name/email)

### 4. Contact Duplication ✅
- [ ] Duplicate contact button works
- [ ] Confirmation dialog appears
- [ ] New contact created with all data except email
- [ ] Email field is cleared in duplicate

### 5. Notes System ✅
- [ ] Add note to contact
- [ ] Edit existing note
- [ ] Delete note
- [ ] User attribution displayed
- [ ] Timestamps shown

### 6. Custom Fields ✅
- [ ] Add custom field (key-value pair)
- [ ] Edit custom field
- [ ] Delete custom field
- [ ] Maximum 5 fields limit enforced
- [ ] Fields persist after page refresh

### 7. Duplicate Email Protection ✅
- [ ] Try to create contact with existing email
- [ ] Should get 422 error with exact payload
- [ ] UI should redirect to existing contact
- [ ] "Duplicate detected" message displayed
- [ ] Check logs for `duplicate_contact_blocked` entry

### 8. Data Scoping & Security ✅
- [ ] Switch to different organization
- [ ] Verify contacts are different (org-scoped)
- [ ] Try to access contact from different org → Should get 404/403
- [ ] Verify notes and custom fields are org-scoped

### 9. Role-Based Access Control ✅
- [ ] Admin can create/edit/delete contacts
- [ ] Admin can manage all notes
- [ ] Member can view contacts
- [ ] Member can add/edit/delete their own notes
- [ ] Member cannot create/edit/delete contacts

## Step-by-Step Testing Flow

### Phase 1: Basic Setup
1. **Start the application**
   ```bash
   php artisan serve
   npm run dev
   ```

2. **Verify health check**
   - Visit `http://localhost:8000/healthz`
   - Should see: `{ "ok": true }`

3. **Login as admin**
   - Visit `http://localhost:8000/login`
   - Use: `admin@example.com` / `password`
   - Should redirect to dashboard

### Phase 2: Organization Testing
1. **Create organization**
   - Click "Organizations" in navigation
   - Click "Create New Organization"
   - Fill: Name: "Test Corp", Slug: "test-corp"
   - Submit → Should create and show in list

2. **Test organization switching**
   - Create second organization: "Demo Inc" / "demo-inc"
   - Click "Switch to this organization" on Demo Inc
   - Verify current org changes
   - Refresh page → Selection should persist

### Phase 3: Contact Management
1. **Create first contact**
   - Go to Contacts page
   - Click "Create New Contact"
   - Fill: First Name: "John", Last Name: "Doe", Email: "john@test.com"
   - Submit → Should create and redirect to contact detail

2. **Test avatar upload**
   - On contact detail page, click "Edit Contact"
   - Upload an image file
   - Save → Avatar should display

3. **Add notes**
   - On contact detail page, click "Add Note"
   - Write: "Initial contact made"
   - Submit → Note should appear with user attribution

4. **Add custom fields**
   - On contact detail page, click "Add Field"
   - Key: "Company", Value: "Test Corp"
   - Submit → Field should appear
   - Add another: Key: "Title", Value: "Manager"

### Phase 4: Duplicate Testing
1. **Test duplicate functionality**
   - On contact detail page, click "Duplicate Contact"
   - Confirm duplication
   - New contact should be created with all data except email

2. **Test duplicate email protection**
   - Try to create another contact with email "john@test.com"
   - Should get error and redirect to existing contact
   - Check browser console for 422 response

### Phase 5: Advanced Features
1. **Test search functionality**
   - Go to Contacts list
   - Use search box to find "John Doe"
   - Results should filter correctly

2. **Test member permissions**
   - Logout
   - Login as: `member@example.com` / `password`
   - Verify can view contacts but not create/edit/delete
   - Verify can add/edit/delete own notes

3. **Test cross-org isolation**
   - Switch to different organization
   - Verify contacts list is empty/different
   - Try to access contact URL from previous org → Should get 404/403

## Automated Testing

Run the test suite to verify core functionality:

```bash
php artisan test
```

**Required Tests (must pass):**
- ✅ Cross-organization isolation test
- ✅ Duplicate email blocking test

## Manual Testing Scenarios

### Scenario 1: Complete Contact Lifecycle
1. Create organization
2. Create contact with avatar
3. Add multiple notes
4. Add custom fields
5. Duplicate contact
6. Edit duplicate
7. Delete original contact

### Scenario 2: Organization Switching
1. Create multiple organizations
2. Add contacts to each
3. Switch between organizations
4. Verify data isolation
5. Test session persistence

### Scenario 3: Error Handling
1. Try duplicate email creation
2. Verify 422 response
3. Check UI redirection
4. Verify error messages
5. Check application logs

## Common Issues & Solutions

### Issue: Avatar not displaying
**Solution**: Ensure `php artisan storage:link` was run

### Issue: Organization switching not working
**Solution**: Check browser console for errors, verify routes are loaded

### Issue: Notes not saving
**Solution**: Check database connection, verify user authentication

### Issue: Custom fields limit not enforced
**Solution**: Verify backend validation is working

## Performance Testing

1. **Load testing**: Create 100+ contacts and verify performance
2. **Search testing**: Test search with large datasets
3. **Avatar testing**: Test with various image sizes and formats

## Security Testing

1. **Cross-org access**: Verify no data leakage between organizations
2. **Role enforcement**: Test permission boundaries
3. **Input validation**: Test with malicious input
4. **Session security**: Test session fixation and hijacking

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Mobile Testing

- ✅ Responsive design
- ✅ Touch interactions
- ✅ Mobile navigation

## Final Verification

Before submission, ensure:
- [ ] All functionality works as specified
- [ ] No cross-organization data access
- [ ] Duplicate email protection works exactly as required
- [ ] UI is minimal black and white
- [ ] All tests pass
- [ ] Code is formatted with Pint
- [ ] No secrets committed to repository

## GitHub Submission

**IMPORTANT**: You need to push your code to GitHub and share the link for evaluation.

1. **Create GitHub repository**
2. **Push your code**
3. **Share the repository URL**
4. **Ensure all documentation is included**

The repository should contain:
- ✅ Complete source code
- ✅ README.md with setup instructions
- ✅ DESIGN.md with architecture
- ✅ AI_NOTES.md with AI usage
- ✅ TESTS.md with test results
- ✅ HOW_TO_TEST.md (this file)
- ✅ .env.example
- ✅ All required documentation

## Support

If you encounter issues during testing:
1. Check browser console for errors
2. Check Laravel logs (`storage/logs/laravel.log`)
3. Verify database connection
4. Ensure all migrations are run
5. Check file permissions for storage

**Remember**: This application demonstrates production-ready code quality with proper error handling, security, and user experience. All requirements must be met for successful evaluation.
