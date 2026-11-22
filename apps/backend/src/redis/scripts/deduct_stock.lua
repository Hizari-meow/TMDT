-- deduct_stock.lua
-- Atomic stock validation and decrement script for high-concurrency flash sales.
-- 
-- KEYS[1]: Redis stock key (e.g., 'stock:flash_sale:<id>')
-- ARGV[1]: Quantity to deduct (positive integer, e.g., 1)
--
-- Return codes:
--   >= 0 : Success, returns the new remaining stock after decrement
--   -1   : Insufficient stock (Sold Out / Out of Stock)
--   -2   : Stock key does not exist or uninitialized

local stock_key = KEYS[1]
local quantity = tonumber(ARGV[1])

if not quantity or quantity <= 0 then
    quantity = 1
end

-- 1. Check if the stock key exists
local current_stock = redis.call('get', stock_key)
if not current_stock then
    return -2
end

current_stock = tonumber(current_stock)
if not current_stock then
    return -2
end

-- 2. Validate if remaining stock is sufficient
if current_stock < quantity then
    return -1
end

-- 3. Atomically decrement stock
local remaining_stock = redis.call('decrby', stock_key, quantity)
return remaining_stock
