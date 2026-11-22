-- validate_and_consume_token.lua
-- Single-use Action Token verification and immediate consumption.
--
-- KEYS[1]: Token Redis key (e.g., 'token:action:<user_id>:<flash_sale_id>')
-- ARGV[1]: Expected Action Token string
--
-- Return values:
--   1 : Valid token; token consumed (deleted) atomically.
--   0 : Invalid, expired, or non-matching token.

local token_key = KEYS[1]
local expected_token = ARGV[1]

local stored_token = redis.call('get', token_key)

if not stored_token then
    return 0
end

if stored_token == expected_token then
    -- Atomically consume (delete) the token
    redis.call('del', token_key)
    return 1
else
    return 0
end
