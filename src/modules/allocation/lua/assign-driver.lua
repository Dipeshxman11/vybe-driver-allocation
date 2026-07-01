-- KEYS[1] = ride lock key
-- ARGV[1] = driver id

local assigned = redis.call("GET", KEYS[1])

if assigned then
    return 0
end

redis.call("SET", KEYS[1], ARGV[1])

return 1