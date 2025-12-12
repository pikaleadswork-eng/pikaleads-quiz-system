import re

file_path = "client/src/pages/CRM.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the end of Date Range Filter section (before closing </div></div>)
# and insert UTM filters there

utm_filters_code = '''
                
                {/* UTM Campaign Filter */}
                {uniqueCampaigns.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Campaign
                    </label>
                    <Select value={filterCampaign} onValueChange={setFilterCampaign}>
                      <SelectTrigger className="bg-zinc-800">
                        <SelectValue placeholder="All campaigns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All campaigns</SelectItem>
                        {uniqueCampaigns.map((campaign) => (
                          <SelectItem key={campaign as string} value={campaign as string}>
                            {campaign}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Ad Group Filter */}
                {uniqueAdGroups.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Ad Group
                    </label>
                    <Select value={filterAdGroup} onValueChange={setFilterAdGroup}>
                      <SelectTrigger className="bg-zinc-800">
                        <SelectValue placeholder="All ad groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ad groups</SelectItem>
                        {uniqueAdGroups.map((adGroup) => (
                          <SelectItem key={adGroup as string} value={adGroup as string}>
                            {adGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Ad Filter */}
                {uniqueAds.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Ad
                    </label>
                    <Select value={filterAd} onValueChange={setFilterAd}>
                      <SelectTrigger className="bg-zinc-800">
                        <SelectValue placeholder="All ads" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All ads</SelectItem>
                        {uniqueAds.map((ad) => (
                          <SelectItem key={ad as string} value={ad as string}>
                            {ad}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
'''

# Find where to insert (after Date Range Filter closing </div>)
pattern = r'(</div>\s*</div>\s*{/\* Date Range Filter \*/})'
replacement = utm_filters_code + r'\n\1'

# This won't work with regex, let me try a different approach
# Find the line number where Date Range Filter ends
lines = content.split('\n')
insert_line = None
for i, line in enumerate(lines):
    if '</Popover>' in line and i > 300 and i < 350:  # Around line 342
        # Check if next few lines close the date range section
        if i + 3 < len(lines) and '</div>' in lines[i+3]:
            insert_line = i + 4
            break

if insert_line:
    lines.insert(insert_line, utm_filters_code)
    content = '\n'.join(lines)
    
    # Now remove the old UTM Filters Card section (lines 355-510 approximately)
    # Find and remove everything from "/* UTM Filters */" Card to its closing
    pattern = r'\s*{/\* UTM Filters \*/}.*?</Card>\s*\)\s*}\s*'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Merged UTM filters into main popover")
else:
    print("❌ Could not find insertion point")
