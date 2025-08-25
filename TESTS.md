Run tests:

php artisan test

Green output excerpt:

PASS  Tests\Feature\CrossOrgIsolationTest
✓ org a cannot access org b contact

PASS  Tests\Feature\DuplicateEmailTest
✓ duplicate email blocks creation and returns exact payload

Tests: 27 passed (64 assertions)
Duration: 4.69s
