-- rollback_stock.lua
-- Atomic stock rollback / compensation script for cancelled or timed-out orders.
--
-- KEYS[1]: Redis stock key (e.g., 'stock:flash_sale:<id>')
-- ARGV[1]: Quantity to return (positive integer, e.g., 1)
--
-- Return value:
--   Returns the new restored stock count (integer)

local stock_key = KEYS[1]
local quantity = tonumber(ARGV[1])

if not quantity or quantity <= 0 then
    quantity = 1
end

-- Atomically increment stock
local restored_stock = redis.call('incrby', stock_key, quantity)
return restored_stock
