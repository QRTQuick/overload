import json
import re
from typing import List
from app.models import BugReport, SeverityLevel

def parse_ai_response(ai_output: str) -> List[BugReport]:
    try:
        json_match = re.search(r'\[.*\]', ai_output, re.DOTALL)
        if json_match:
            json_str = json_match.group()
        else:
            json_str = ai_output.strip()
        
        bugs_data = json.loads(json_str)
        
        bugs = []
        for bug_data in bugs_data:
            try:
                bug = BugReport(
                    type=bug_data.get("type", "unknown"),
                    severity=SeverityLevel(bug_data.get("severity", "low")),
                    line=bug_data.get("line"),
                    description=bug_data.get("description", "No description"),
                    fix=bug_data.get("fix", "No fix suggestion")
                )
                bugs.append(bug)
            except (ValueError, KeyError) as e:
                print(f"Skipping invalid bug entry: {e}")
                continue
        
        return bugs
        
    except json.JSONDecodeError:
        print(f"Failed to parse AI response as JSON: {ai_output}")
        return []
    except Exception as e:
        print(f"Error parsing AI response: {e}")
        return []