import unittest
from unittest.mock import MagicMock
import sys

# Simplified test logic to verify the parsing of CORS_ORIGINS
def parse_cors_origins(cors_origins_str):
    cors_origins = cors_origins_str
    if cors_origins != '*' and ',' in cors_origins:
        cors_origins = [o.strip() for o in cors_origins.split(',')]
    return cors_origins

class TestCORSLogic(unittest.TestCase):
    def test_asterisk(self):
        self.assertEqual(parse_cors_origins('*'), '*')

    def test_single_origin(self):
        self.assertEqual(parse_cors_origins('http://localhost:3000'), 'http://localhost:3000')

    def test_multiple_origins(self):
        self.assertEqual(parse_cors_origins('http://localhost:3000, http://example.com'), ['http://localhost:3000', 'http://example.com'])

    def test_multiple_origins_no_space(self):
        self.assertEqual(parse_cors_origins('http://localhost:3000,http://example.com'), ['http://localhost:3000', 'http://example.com'])

if __name__ == '__main__':
    unittest.main()
